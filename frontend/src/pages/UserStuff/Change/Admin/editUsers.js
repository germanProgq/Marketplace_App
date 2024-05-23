import React from "react";
import { Link } from "react-router-dom";

const EditUsers = () => {
    return (
    <div className="edit">
        <h3 style={{fontSize: '50px', textAlign: 'center',}}>Edit Users</h3>
        <div style={{display: 'flex', gap:'5vw'}}>
            <ul className="what-can-be-changed-row" >
                <h5 className="settings-name">Delete User (by)</h5>
                <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <button>
                    <Link to={`/admin/delete/user`}>Info (email || username)</Link>         
                    </button>
                </li>
            </ul>
            <ul className="what-can-be-changed-row">
                <h5 className="settings-name">Change User (force)</h5>
                <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <button>
                    <Link to={`/admin/change/user-stuf`}>Info (email || username)</Link>         
                    </button>                   
                </li>
            </ul>
        </div>
    </div>
    )
}
export default EditUsers