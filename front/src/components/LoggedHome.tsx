import React from "react";
import HomeCard from "./HomeCard";
import { Role, Icons } from "../assets/constants";
import { appContext } from "../App";
import Icon from "./Icons";
import "../css/loggedHome.css";
import "../css/logohome.css";

interface MenuItem {
  title: string;
  icon: Icons;
  destiny: string;
}

const commonItems: MenuItem[] = [
 
];

const studentItems: MenuItem[] = [
  {
    title: "Procedimientos",
    icon: Icons.Procedure,
    destiny: "/procedimientos",
  },
];

const teacherItems: MenuItem[] = [
  {
    title: "Estudiantes",
    icon: Icons.Student,
    destiny: "/estudiantes",
  },
  {
    title: "Pasos",
    icon: Icons.Steps,
    destiny: "/pasos",
  },
];

const adminItems: MenuItem[] = [
  {
    title: "Usuarios",
    icon: Icons.Identity,
    destiny: "/admin/usuarios",
  },
  {
    title: "Roles",
    icon: Icons.Role,
    destiny: "/admin/roles",
  },
  {
    title: "Permisos",
    icon: Icons.Check,
    destiny: "/admin/permisos",
  },
];

export default function LoggedHome() {
  const context = React.useContext(appContext);
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (context.user.role == Role.Student) {
      setItems([...commonItems, ...studentItems]);
    } else if (context.user.role == Role.Teacher) {
      setItems([...commonItems, ...teacherItems]);
    } else if (context.user.role == Role.Admin) {
      setItems([...adminItems]);
    }
  }, [context.user.role]);

  return (
    <div className="loggedHome">
      <div>
      </div>
      <div className="scalein animation-duration-1000">
        <HomeCard
          title={"Panel de usuario"}
          icon={Icons.Identity}
          destiny={"/panel"}
        />
      </div>
      {context.user.role != Role.Admin ?<div className="scalein animation-duration-1000">
       <HomeCard
          title={"Utensilios"}
          icon={Icons.Tools}
          destiny={"/herramientas"}
        />
      </div>: <div></div>}
      <div className="no"/>
      {context.user.role != Role.Admin ?<div className="scalein animation-duration-1000">
        <HomeCard
          title={"Practicas"}
          icon={Icons.ListCheck}
          destiny={"/practicas"}
        />
      </div>: <div></div>}      
      <div className="row justify-content-between">
        {items.map((item, index) => (
          <div className="scalein animation-duration-1000 flex gap-3">
            <HomeCard
              title={item.title}
              icon={item.icon}
              destiny={item.destiny}
            />
          </div>
        ))}
      </div>
      <div className="no"/>
      {context.user.role != Role.Admin ?<div className="scalein animation-duration-1000">
        <HomeCard
          title={"Procedimientos"}
          icon={Icons.Procedure}
          destiny={"/procedimientos"}
        />
      </div>: <div></div>}
    </div>
    
  );
}
