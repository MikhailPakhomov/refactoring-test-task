import { memo } from 'react';
import './styles.css';

interface IProps {
    id: number;
    selected: boolean;
    name: string;
    onChange: (id: number) => void;
    index: number;
}

export const User = memo(({ id, selected, name, onChange, index }: IProps) => {
    return (
        <li>
            <label className="user" key={id}>
                <input
                    key={index}
                    type="checkbox"
                    checked={selected}
                    onChange={() => onChange(id)}
                />
                {name}
            </label>
        </li>
    );
});
