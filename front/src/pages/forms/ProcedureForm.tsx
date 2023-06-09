import React, { useState, useRef } from "react";
import { Status } from "../../assets/constants";
import SubmitButton from "../../components/form/SubmitButton";
import { FileUpload } from "primereact/fileupload";
import InputTxt from "../../components/form/InputTxt";
import PickListt from "../../components/form/Picklist";
import Picklist from "../../interfaces/Picklist";
import { useParams } from "react-router-dom";
import "../../css/picklist.css";
import "./../../css/procedureform.css";
import { appContext } from "../../App";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { Image } from 'primereact/image';


interface Iprops {}

interface Iprocedure {
    name: string;
    imageDirection: string;
    stepIds: any[],
  
}

export default function ToolForm(props: Iprops) {
  const { id } = useParams();
  const context = React.useContext(appContext);
  const [valid , setValid] = useState<boolean>(false);

  //Parte del nombre del procedimiento
  const [name, setName] = useState<string>("");

  const handleName = (name: string) => {
    setName(name);
  };

  //Parte de la imagen del procedimiento
  const [imageDirection, setImageDirection] = useState<string>("");
  const [src, setSrc] = useState<string>('');

  

  const onUpload = async ({ files }: any) => {  
        const [file] = files;    

   if(imageDirection === ""){
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      let result = await context.apiCalls.uploadImageBase64(e.target.result);
      setImageDirection(result);
      setSrc(result)
    };
    reader.readAsDataURL(file);   
   
  }else{
    let img = imageDirection.split("images/")
    let deleteImg = img[1]
    let res = await context.apiCalls.deleteImage(deleteImg);
   
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      let result = await context.apiCalls.uploadImageBase64(e.target.result);
      setImageDirection(result);
      setSrc(result)
    };
    reader.readAsDataURL(file);
  }
}
    
 





  //Parte de los pasos del procedimiento
  const [source, setSource] = React.useState<Picklist[]>([]);
  const [stepIds, setStepIds] = React.useState<any>([]);
  const [target, setTarget] = React.useState<Picklist[]>([]);
  const [idAsociados, setIdAsociados] = React.useState<any>([]);

  const onChange = (event: { source: Picklist[]; target: Picklist[] }) => {
    setSource(event.source);
    setTarget(event.target);
    const ids = event.target.map((item) => item.code);
    setStepIds(ids);
  };

//Validación
const toast = useRef<any>(null);
const [status, setStatus] = React.useState<Status>(Status.error);

  //Funcionalidad de carga de la pagina
  React.useEffect(() => {
    allSteps();
    if (id) {
      const procedureEdit = async () => {
        const res = await context.apiCalls.getProcedure(id);
        const data = await res.json();
        setName(data.name);
        setImageDirection(data.image);
        setSrc(data.image);       
        setIdAsociados(data.steps);
        setTarget(data.steps);
      };
      procedureEdit();
    }
  }, []);

  const allSteps = async () => {
    const res = await context.apiCalls.getSteps();
    const steps = res.map((step: Picklist) => {
      return {
        id: step.id,
        code: step.id,
        name: step.name,
        description: step.description,
        image: step.image,
        rating: step.id,
      };
    });

    setSource(steps);
  };

  //Funcionalidad del boton de submit
  const [ctx, setCtx] = useState<any>(null);

  React.useEffect(() => {
    let currentCtx : Iprocedure = {
        name: name ? name : '',
        imageDirection: imageDirection ? imageDirection :  '',
        stepIds : stepIds ? stepIds : [],
    };
    setCtx(currentCtx);
}, [name, imageDirection, stepIds]);


React.useEffect(() => { 
    
  if(name === '' || stepIds.length === 0 ){ 
    setValid(true);
  } else {
    setValid(false);
  }
}, [name, stepIds]);



//Funcionalidad de creación y edición de herramientas
const navigate = useNavigate();

const handleProcedure = async () => {
      if(id){
       
        const resEdit = await context.apiCalls.editProcedure(id,name,imageDirection);
      
        if (resEdit.ok ) {
            setStatus(Status.success);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Procedimiento actualizado correctamente', life: 3000 });
         
            setTimeout(function(){
               navigate('/procedimientos')
             }, 1000);

        } else {
            setStatus(Status.error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'El procedimiento no ha podido actualizarse', life: 3000 });
        }
        }else{
                 
            const res = await context.apiCalls.createProcedure(ctx);    
            if (res.ok) {
                setStatus(Status.success);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Procedimiento creado correctamente', life: 3000 });                
                setTimeout(function(){
                  navigate('/procedimientos')
                }, 1000);
            } else {
                setStatus(Status.error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se ha podido crear el procedimiento', life: 3000 });
            }
}}



  return (
    <div  className='p-3 col-12 flex flex-column justify-content-center align-items-center'>
      <div id="procedureform" className='p-6 col-12 '>
      <div id="inputsform-procedureform" className="flex row py-0 col-12">
        <div id="inputtxt-procedureform" className="col-12 ">  
        <InputTxt
          name={name}
          handleName={handleName}
          labelname={"Nombre del procedimiento"}
        />
      </div>
      <div id="file-procedure" className=" col-4 file-procedure">
        <FileUpload
          name="image"         
          onSelect={onUpload}  
          chooseLabel="Cargar imagenes"
          mode="basic"
          accept="image/*"
          auto={true}
        />
      
        <label htmlFor="file"></label>
        </div>
     
      <div className='col-3 flex justify-content-center align-content-center' id="img-procedureform" >
         <Image src={src} />
       </div>
      </div>
      <div id="picklist" className="p-field col-10 xl:col-10 lg:col-10 md:col-12 sm:col-12"> 
        <PickListt source={source} onChange={onChange} target={target} />
      </div>
      <div  id="button-procedureform" className="col-2 xl:col-2 lg:col-2 md:col-3 sm:col-3">
        <SubmitButton
          isLogin={false}
          disabled={valid}   
          onclik={handleProcedure}
          ctx={ctx}
        />
          <Toast ref={toast} />
      </div>
    </div>
    </div> 
  );
}


