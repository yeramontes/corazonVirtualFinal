import React, { createRef, useRef } from 'react'
import '../css/newStudents.css'
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Button } from 'primereact/button';
import { appContext } from '../App';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Password } from 'primereact/password';

export default function NewStudents() {

    const navigate = useNavigate();

    const [file, setFile] = useState<File>();
    const [students, setStudents] = useState<any[]>([]);
    const [dataViewStudents, setDataViewStudents] = useState<any[]>([]);

    const fileUpload = useRef(null);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const ctx = React.useContext(appContext);

    const handleUpload = (e: any) => {
        if (e.files == null) return;
        setFile(e.files[0]);
    }

    const leerArchivo = () => {
        if (file == null) return;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const lineas = reader.result?.toString().split('\r\n');
            const headers = ['nombre', 'email', 'password'];
            let firstLine = lineas ? lineas[0] : '';
            firstLine.split(';').forEach((header) => {
                if (headers.includes(header.toLowerCase())) lineas?.shift();
            });
            
            setStudents([]);
            lineas?.forEach((linea) => {
                const usuario = linea.split(';');
                if( usuario[0] == '' || usuario[1] == '' || usuario[2] == '') return;
                setStudents(students => [...students, usuario]);
            });
        }
        if (fileUpload.current) {
            // @ts-ignore
            fileUpload.current.clear();
        }
    }

    const añadirUsuarios = async () => {
        const apikey = sessionStorage.getItem('apiKey');
        let resultado = `Nombre;Email;Password\n`;

        const genCsv = async () => {
            for (const student of students) {
                let res = await ctx.apiCalls.register(student[0], student[1], student[2]);

                if (res.status == 201) {
                    resultado += `${student[0]};${student[1]};${student[2]}\n`;
                }
            }
        }
        await genCsv()
        const blob = new Blob([resultado], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'estudiantes_registrados.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        navigate('/estudiantes');
    }


    const handleDelete = (e: Array<string>) => {
        setStudents(students.filter((student) => student[1] !== e[1]));
    }

    const downloadPlantilla = () => {
        const plantilla = 'Nombre;Email;Password\n';
        const blob = new Blob([plantilla], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'plantilla.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    useEffect(() => {
        leerArchivo();
    }, [file])

    useEffect(() => {
        setDataViewStudents(students.map((student) => {

            return [student[0], student[1], student[2].replace(/./g, '*')];
        }))
    }, [students])

    return (
        <div id='newStudents' className='flex flex-column justify-content-center'>
            <div>
                <div className='flex flex-wrap gap-2 justify-content-between align-items-center'>
                    <FileUpload mode="basic" auto name="demo[]"
                        ref={fileUpload}
                        customUpload uploadHandler={(e) => handleUpload(e)}
                        chooseOptions={{
                            icon: 'pi pi-upload',
                            label: 'Seleccionar archivo'
                        }}
                    />

                    <Button icon="pi pi-download" label='Plantilla' onClick={() => downloadPlantilla()} />
                    <Button icon="pi pi-user-plus" label='Nuevo usuario' onClick={() => setModalVisible(true)} />

                    <Button icon="pi pi-save" label='Añadir' onClick={añadirUsuarios} />
                </div>
                <Dialog header="Nuevo usuario" visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                    <div className='flex flex-row align-content-center'>
                        <div className='col-8 flex flex-column justify-content-center gap-2'>
                            <InputText placeholder='Nombre' onChange={(e) => setName(e.target.value)} />
                            <InputText placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                            <Password placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='col-4 flex justify-content-center align-items-center'>
                            <Button icon="pi pi-plus" onClick={() => {
                                setStudents(students => [...students, [name, email, password]])
                                setModalVisible(false);
                            }} />
                        </div>
                    </div>
                </Dialog>
                <div className='pt-4'>
                    <Table dataElements={dataViewStudents} showDelete={true} onDelete={handleDelete} onEdit='' />
                </div>
            </div>
        </div>
    )
}
