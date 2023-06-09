namespace aspnetapp.Models;

public class Tool
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string Description { get; set; }

    public string Modelo { get; set; }   

    public double OptimalScale { get; set; }

    public virtual ICollection<Step>? Steps { get; set; }
}