import { useFBX } from "@react-three/drei";
import { appContext } from "../App";
import React from "react";


interface Iprops {
  path: string;
}



export default function Model(props: Iprops) {
  

    const context = React.useContext(appContext);


    const fbx = useFBX(`http://localhost:8000/images/${props.path}`);

    return(
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 3, 0]} scale={[0.1, 0.1, 0.1]}>
        
        <primitive object={fbx }  scale={0.1}/>
      </mesh>
      ); ;
}