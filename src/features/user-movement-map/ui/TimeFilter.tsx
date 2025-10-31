import {Select} from '../../../shared/ui';

interface TimeFilterProps {
    value: number;
    onChange: (value: number) => void;
}

const timeOptions = [
    {value: '24', label: 'Последние 24 часа'},
    {value: '48', label: 'Последние 48 часов'},
    {value: '168', label: 'Последние 7 дней'}, // 7 * 24 = 168
    {value: '720', label: 'Последние 30 дней'}, // 30 * 24 = 720
];

export const TimeFilter = ({value, onChange}: TimeFilterProps) => {
    return (
        <div className="time-filter">
            <label className="time-filter-label">Период:</label>
            <Select
                value={value.toString()}
                onChange={(newValue) => onChange(Number(newValue))}
                options={timeOptions}
            />
        </div>
    );
};
