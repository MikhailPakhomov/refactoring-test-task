import { useEffect, useState } from 'react';
import { fetchUserData, IUserResponse } from '../helpers/helpers';
import { UserList } from './UserList/UserList';

export default function App() {
    const [data, setData] = useState<IUserResponse[]>([]);

    useEffect(() => {
        const updateData = async () => {
            const newData = await fetchUserData();
            setData(newData);
        };

        updateData();
    }, []);

    if (data.length) {
        return <UserList data={data} />;
    }

    return <div>Приложение загружается</div>;
}
