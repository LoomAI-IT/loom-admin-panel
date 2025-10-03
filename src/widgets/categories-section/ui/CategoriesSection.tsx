import { useState, useEffect } from 'react';
import { categoryApi, type Category } from '../../../entities/category';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import './CategoriesSection.css';

interface CategoriesSectionProps {
  organizationId: number;
}

export const CategoriesSection = ({ organizationId }: CategoriesSectionProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [organizationId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getByOrganization(organizationId);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="categories-section loading">Загрузка рубрик...</div>;
  }

  return (
    <div className="categories-section">
      <div className="section-header">
        <h2>Рубрики</h2>
        <Button size="small">Добавить рубрику</Button>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">Рубрики не найдены</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>ID</TableCell>
              <TableCell header>Название</TableCell>
              <TableCell header>Цель</TableCell>
              <TableCell header>Дата создания</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.goal || 'Не указана'}</TableCell>
                <TableCell>{new Date(category.created_at).toLocaleString('ru-RU')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
