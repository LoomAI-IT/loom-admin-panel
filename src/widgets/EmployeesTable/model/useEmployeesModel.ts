import * as React from 'react';
import {useCallback, useState} from 'react';
import {type Employee, employeeApi} from '../../../entities/employee';

interface UseEmployeesModelProps {
    organizationId: number;
}

export const useEmployeesModel = ({organizationId}: UseEmployeesModelProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeApi.getByOrganization(organizationId);
            setEmployees(response.employees);
        } catch (err) {
            setError('Ошибка при загрузке сотрудников');
            console.error('Failed to load employees:', err);
        } finally {
            setLoading(false);
        }
    }, [organizationId]);

    React.useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const createEmployee = async (request: any) => {
        await employeeApi.create(request);
    };

    const updateEmployeeRole = async (roleRequest: any) => {
        await employeeApi.updateRole(roleRequest);
    };

    const updateEmployeePermissions = async (permissionsRequest: any) => {
        await employeeApi.updatePermissions(permissionsRequest);
    };

    const deleteEmployee = async (accountId: number) => {
        await employeeApi.delete(accountId);
    };

    return {
        // State
        employees,
        loading,
        error,

        // Actions
        refresh: loadEmployees,
        createEmployee,
        updateEmployeeRole,
        updateEmployeePermissions,
        deleteEmployee,
    };
};
