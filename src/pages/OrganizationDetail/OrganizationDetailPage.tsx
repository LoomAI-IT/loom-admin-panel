import * as React from 'react';
import {useParams} from 'react-router-dom';

import {CategoriesTable} from '../../widgets/CategoriesTable';
import {AutopostingsTable} from '../../widgets/AutopostingsTable';
import {OrganizationDetail} from '../../widgets/OrganizationDetail';

import './OrganizationDetailPage.css';

export const OrganizationDetailPage = () => {
    const {organizationId} = useParams<{ organizationId: string }>();

    if (!organizationId) {
        return (
            <div>
                <div>
                    <div>ID организации не указан</div>
                </div>
            </div>
        );
    }

    return (
        <div className="organization-detail-page">
            <OrganizationDetail/>

            <CategoriesTable organizationId={Number(organizationId)}/>

            <AutopostingsTable organizationId={Number(organizationId)}/>
        </div>
    );
};
