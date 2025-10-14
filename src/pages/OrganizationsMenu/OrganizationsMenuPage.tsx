import {OrganizationsTable} from '../../widgets/OrganizationsTable';
import './OrganizationsMenuPage.css';
import {Sidebar} from "../../widgets/Sidebar";

export const OrganizationsMenuPage = () => {
    return (
        <div>
            <Sidebar/>
            <div>
                <OrganizationsTable/>
            </div>
        </div>
    );
};
