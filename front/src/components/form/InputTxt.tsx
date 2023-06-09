import React, { useState } from "react";
import { InputText, InputTextProps  } from 'primereact/inputtext';
import '../../css/inputs.css';


class Iprops {
    handleName!: Function;
    name!: string;
    labelname!: string;

}

export default function InputTxt(props : Iprops) {

       
    return (
        <div className="card flex justify-content-center">
            <span className="p-float-label">
                <InputText id="name" value={props.name} onChange={(e : any) => props.handleName(e.target.value)} onKeyDown={(e : React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" || e.key === "Tab") {
                    props.handleName(e.currentTarget.value);                  
                    }
                 }}/>               
                <label htmlFor="name">{props.labelname}</label>
            </span>
        </div>
    )
}


