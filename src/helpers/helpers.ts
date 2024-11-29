import { getRandomName } from './additionalHelpers';

//Список выводимых пользователей
//можно на время рефакторинга уменьшить
//чтобы было меньше тормозов, но замеры делаются на 1000
const USER_COUNT = 1000;

export interface IUserResponse {
    id: number;
    name: string;
    children?: IUserResponse[];
}

interface IUserList {
    id: number;
    name: string;
    selected: boolean;
}

//Функция эмулятор получения данных с бекенда
//смысл в ней искать не нужно, важно что она возвращает данные в не готовом виде для фронтенда
//(т.е. на фронтенде потребуется преобразовнаие данных, чтобы получить нормальный список пользователей)
export const fetchUserData = (): Promise<IUserResponse[]> => {
    const getChilren = () => {
        const children: IUserResponse[] = [];
        for (let k = 1; k <= 20; k++) {
            children.push({
                id: Math.round(USER_COUNT - k),
                name: `${getRandomName()} ${getRandomName()}`,
            });
        }
        return children;
    };

    const data: IUserResponse[] = [];
    for (let k = 1; k <= USER_COUNT; k++) {
        data.push({
            id: Math.round(USER_COUNT - k),
            name: `${getRandomName()} ${getRandomName()}`,
            children: getChilren(),
        });
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};

//сложный алгоритм который нельзя менять
//он преобразует полученный с "бекенда" список в тот который нужен компоненту
// (обычный плоский список пользователей)
//в суть алгоритма лезть не нужно, главное понять что эта функция "тяжелая"
export const getUserList = (data: IUserResponse[]) => {
    const list = data.reduce<IUserList[]>((acc, { id, name, children }) => {
        const childrenUsers =
            children?.map(({ id, name }) => ({ id, name, selected: false })) ??
            [];
        const newAcc = [
            ...acc,
            { id, name, selected: false },
            ...childrenUsers,
        ];
        return newAcc;
    }, []);
    const ids = list.map(({ id }) => id);
    const uniqueIds = ids.reduce<number[]>((acc, id) => {
        if (acc.includes(id)) {
            return acc;
        }
        return [...acc, id];
    }, []);

    const userList = uniqueIds.map(id => {
        return list.find(element => element.id === id) as IUserList;
    });

    return userList;
};

let countRunningUpdateRequests = 0;

//Функция эмулятор отправки запроса на бекенд, предполагается что она принимает
//пользователя и отправляет его на бек для сохранения. Если одновременно запускается несколько
//подобных функций то время ответа увеличивается пропорционально количеству запущенных функций
export const updateUser = async (user: IUserList): Promise<IUserList> => {
    return new Promise(resolve => {
        countRunningUpdateRequests += 1;
        setTimeout(() => {
            resolve(user);
            countRunningUpdateRequests -= 1;
        }, countRunningUpdateRequests);
    });
};

//Класс профайлера нужен для замера времени выполнения клика
//создание класса стартует замер
//вызов метода endProfile завершает замер и выводит
//результаты в консоль
export const ClickProfiler = class {
    startTime: number;

    constructor() {
        this.startTime = new Date().getTime();
    }

    endProfile = () => {
        const endTime = new Date().getTime();
        console.log(`Click execution time ${endTime - this.startTime}`);
    };
};
