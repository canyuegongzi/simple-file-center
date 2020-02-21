
const config = {
    connectMicroservice: 3002, // 微服务端口
    port: 8883,
    tokenSetTimeOut: 7200,
    // host: 'http://127.0.0.1:8883',
    host: 'http://47.106.104.22:8883',
};

export const redisConfig = {
    name: 'user_token',
    url: 'redis://127.0.0.1:6379/4',
};

export const qiniuConfig = {
    accessKey : 'FvMDqzTOAATbu873LzVjBx0pxpUFkRFSCNbVDMlM',    // accessKey
    secretKey : '5LGhaaH6UyGyZfjoiHJ_c_YkNKDREFxugFnx6lbh',    // secretKey
    options: {
        accessKey : 'FvMDqzTOAATbu873LzVjBx0pxpUFkRFSCNbVDMlM',    // accessKey
        secretKey : '5LGhaaH6UyGyZfjoiHJ_c_YkNKDREFxugFnx6lbh',    // secretKey
        scope: 'canyuegongzi',
        expires: 7200,
        bucket: 'bucket',
        origin: '',
    },
};

export const qiniuUploadConfig = {
    accessKey : 'FvMDqzTOAATbu873LzVjBx0pxpUFkRFSCNbVDMlM',    // accessKey
    secretKey : '5LGhaaH6UyGyZfjoiHJ_c_YkNKDREFxugFnx6lbh',    // secretKey
    bucket: 'bucket',
    origin: '',
    persistentNotifyUrl: 'http://qiniu.canyuegongzi.xyz/',
};
export default config;
