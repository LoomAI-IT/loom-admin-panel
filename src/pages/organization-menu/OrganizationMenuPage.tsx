import {OrganizationsTable} from '../../widgets/organization-table';
import './OrganizationMenuPage.css';
import {Sidebar} from "../../widgets/sidebar";

export const OrganizationMenuPage = () => {
    return (
        <div>
            <Sidebar/>
            <div>
                <OrganizationsTable/>
            </div>
        </div>
    );
};
