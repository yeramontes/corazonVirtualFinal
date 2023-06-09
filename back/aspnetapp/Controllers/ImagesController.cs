using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using aspnetapp.Models;
using aspnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace aspnetapp.Controllers
{
    [Route("images")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly dataContext _context;


        public ImagesController(dataContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Upload an image
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /images
        ///
        /// </remarks>
        /// <returns>Route of uploaded image</returns>
        /// <response code="200">Returns the image route</response>
        /// <response code="401">If the user is not authenticated</response>
        /// <response code="500">If there is a connection failure with the database </response>
        [HttpPost]
        [Authorize(AuthenticationSchemes = $"{Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme},ApiKey")]
        public async Task<ActionResult<string>> PostImage([FromForm] Image image)
        {
            if (image.Img != null)
            {
                var img = image.Img;
                var extension = img.FileName.Split('.').Last(); 
                var imageName = $"{Guid.NewGuid()}.{extension}";
                var folder = ""; 

                if(extension == "fbx"){
                    folder = "images3d";
                     
                }else if(extension == "png" || extension == "jpg" || extension == "jpeg"){
                    folder = "images";
                }else {
                    return StatusCode(415, "Unsupported Media Type");
                }

                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder, imageName);

                if(!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder)))
                    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder));

                

                using (var bits = new FileStream(path, FileMode.Create))
                {
                    await img.CopyToAsync(bits);
                }

                return Ok($"{Request.Scheme}://{Request.Host}/images/{imageName}");
            }

            return BadRequest();
        }

        /// <summary>
        /// Get an image
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /images/{id}
        ///
        /// </remarks>
        /// <returns>Image</returns>
        /// <response code="200">Returns the image</response>
        /// <response code="404">If the image is not found</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<string>> GetImage(string id)
        {
            var image = null as Stream;

            if(id.Split('.').Last() == "fbx")
                image = System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images3d", id)) ? System.IO.File.OpenRead(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images3d", id)) : null;
               
            else
                image = System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", id)) ? System.IO.File.OpenRead(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", id)) : null;
                

            if (image == null)
            {
                return NotFound();
            }
            
            return Ok(image);
        }

        /// <summary>
        /// Upload an image with a base64 string
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /images/base64
        ///     {
        ///        "Img": "base64 string"
        ///     }
        ///
        /// </remarks>
        /// <returns>Route of uploaded image</returns>
        /// <response code="200">Returns the image route</response>
        /// <response code="401">If the user is not authenticated</response>
        /// <response code="500">If there is a connection failure with the database </response>
        [HttpPost("base64")]
        [Authorize(AuthenticationSchemes = $"{Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme},ApiKey")]
        public async Task<ActionResult<string>> PostImageBase64([FromBody] Image64 image)
        {
           // convert string from base64 to image

                var bytes = Convert.FromBase64String(image.Image);
                var imageName = $"{Guid.NewGuid()}.png";
                var folder = "images";
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder, imageName);

                if(!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder)))
                    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder));


                using (var bits = new FileStream(path, FileMode.Create))
                {
                    await bits.WriteAsync(bytes, 0, bytes.Length);
                }
   
                return Ok($"{Request.Scheme}://{Request.Host}/images/{imageName}");
        }

        /// <summary>
        /// POST a fbx with a base64 string
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /images/base64fbx
        ///     {
        ///        "Img": "base64 string"
        ///     }
        ///
        /// </remarks>
        /// <returns>Route of uploaded image</returns>
        /// <response code="200">Returns the image route</response>
        /// <response code="401">If the user is not authenticated</response>
        /// <response code="500">If there is a connection failure with the database </response>
        [HttpPost("base64fbx")]
        [Authorize(AuthenticationSchemes = $"{Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme},ApiKey")]
        public async Task<ActionResult<string>> PostImageBase64Fbx([FromBody] Image64 image)
        {
           // convert string from base64 to image

                var bytes = Convert.FromBase64String(image.Image);
                var imageName = $"{Guid.NewGuid()}.fbx";
                var folder = "images3d";               
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder, imageName);

                if(!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder)))
                    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder));

                using (var bits = new FileStream(path, FileMode.Create))
                {
                    await bits.WriteAsync(bytes, 0, bytes.Length);
                }

                // return Ok($"{Request.Scheme}://{Request.Host}/images3d/{imageName}");
                return Ok($"{imageName}");
        }


        /// <summary>
        /// DELETE a image
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /images/{id}
        ///
        ///
        /// </remarks>
        /// <returns>Route of uploaded image</returns>
        /// <response code="200">Returns the image route</response>
        /// <response code="401">If the user is not authenticated</response>
        /// <response code="500">If there is a connection failure with the database </response>

            [HttpDelete("{id}")]
            [Authorize(AuthenticationSchemes = $"{Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme},ApiKey")]
            public async Task<ActionResult<string>> DeleteImage(string id)
            {
                var image = null as Stream;

                if(id.Split('.').Last() == "fbx"){
                    var folder = "images3d";
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder, id);
                    if (System.IO.File.Exists(path))
                    {
                        System.IO.File.Delete(path);
                        return Ok();
                    }
                    else
                    {
                        return NotFound();
                    }
                }
                else{
                    var folder = "images";
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folder, id);
                    if (System.IO.File.Exists(path))
                    {
                        System.IO.File.Delete(path);
                        return Ok();
                    }
                    else
                    {
                        return NotFound();
                    }
                }
               
            }


    }
}




