import React, { useState, useRef } from "react";
import { Status } from "../assets/constants";
import { appContext } from "../App";
import Table from "../components/Table";
import IStep from "../interfaces/Step";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import defaultImage from './../img/defaultImage.jpeg'
import Modal from "../components/Modal";
import { Toast } from "primereact/toast";
import "./../css/steps.css"


class Iprops {}

export default function Steps(props: Iprops) {

    const context = React.useContext(appContext);
    const [steps, setSteps] = React.useState([]);
    const toast = useRef<any>(null);
    const [status, setStatus] = React.useState<Status>(Status.error);
    const navigate = useNavigate();

    const initialize = async () => {
        const response = await context.apiCalls.getSteps();
        const steps = response.map((step: IStep) => {
            return {
                Id: step.id,
                Nombre: step.name,
                Descripcion: <Modal content={step.description} />,
                Duracion: step.duration,
                Imagen: <Image className="td-image" src={step.image != "default"? step.image : defaultImage} alt="Image" width="250" />,
                Previo: step.previousStep? 'Si' : 'No',
               
            }
        })

        setSteps(steps);
        
    };

    React.useEffect(() => {
       initialize();
    }, []);


    const  onDelete =  async (id: number) => {
        
        console.log("id dentro de ondelete antes de borrar", id)
        const res = await context.apiCalls.deleteStep(id);
        console.log("dentro de ondelete despues de borrar")
        if (res.ok) {
            setStatus(Status.success);         
            toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'El paso se ha borrado', life: 3000 });
            setTimeout(function(){
                window.location.reload();
             }, 1000);
            
        } else {
            setStatus(Status.error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la operacion', life: 3000 });
        }
      
       
    }

  

  return (
    <div id="stepsView">

        <Button label="Crear paso" severity="secondary" onClick={()=> {navigate("/pasos/formulario")}}/>
        <Table 
            dataElements={steps}
            showOptions
            onEdit = "/pasos/formulario"
            onDelete={(e:any) => onDelete}
            />
        <Toast ref={toast} />
    </div>
  );
}
