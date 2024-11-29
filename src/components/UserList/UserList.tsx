import './styles.css';
import { useCallback, useEffect, useState } from 'react';
import {
    getUserList,
    ClickProfiler,
    updateUser,
    IUserResponse,
} from '../../helpers/helpers';
import { User } from '../User/User';

let clickProfiler: InstanceType<typeof ClickProfiler>;

interface IProps {
    data: IUserResponse[];
}

export const UserList = ({ data }: IProps) => {
    const [userList, setUserList] = useState(getUserList(data));
    const getTotalSelectedItems = useCallback(
        () =>
            userList.filter(user => {
                return !!user.selected;
            }).length,
        [userList]
    );

    const [totalSelectedItems, setTotalSelectedItems] = useState(
        getTotalSelectedItems()
    );
    const [totalUnselectedItems, setTotalUnselectedItems] = useState(
        userList.length - getTotalSelectedItems()
    );

    const totalItem = userList.length;

    const onChange = (id: number) => {
        clickProfiler = new ClickProfiler();
        const newList = userList.map(user => {
            const newUser = { ...user };
            if (user.id === id) {
                newUser.selected = !newUser.selected;
            }
            return newUser;
        });
        setUserList(newList);
    };

    useEffect(() => {
        setTotalSelectedItems(getTotalSelectedItems());
    }, [userList, getTotalSelectedItems]);

    useEffect(() => {
        setTotalUnselectedItems(totalItem - totalSelectedItems);
    }, [totalSelectedItems, totalItem]);

    const saveAllUsers = useCallback(async () => {
        await Promise.all(userList.map(updateUser));
        clickProfiler?.endProfile();
    }, [userList]);

    useEffect(() => {
        saveAllUsers();
    }, [saveAllUsers]);

    return (
        <div className="user-list-wrapper">
            <div className="counter">Total items: {totalItem}</div>
            <div className="counter">
                Total selected items: {totalSelectedItems}
            </div>
            <div className="counter">
                Total unselected items: {totalUnselectedItems}
            </div>
            <ol className="user-list">
                {userList.map(({ id, selected, name }, index) => (
                    <User
                        id={id}
                        selected={selected}
                        name={name}
                        onChange={onChange}
                        index={index}
                    />
                ))}
            </ol>
        </div>
    );
};
