import Exif from 'exif-js'
import store from 'store'
export const randomWord = (randomFlag, min, max) => {
    let str = "",
        pos = '',
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

export const getQueryString = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

export const getNowFormatDate = (seperator1 = "-", seperator2 = "-", seperator3 = "-") => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator1 + month + seperator2 + strDate + seperator3;
    return currentdate;
}


export const isWeiXin = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
//手机验证
export function mobilePass(moble) {
    if (!/^0?1[1|2|3|4|5|6|7|8|9][0-9]\d{8}$/.test(moble) || moble.length != 11) {
        return false;
    } else {
        return true;
    }
};
//验证码判断
export function identifyingPass(identifyingCodeIpt) {
    if (!/^\d{6}$/.test(identifyingCodeIpt)) {
        return false;
    } else {
        return true;
    }
}
//姓名验证
export function namePass(name) {
    if (!/^([a-zA-Z\u4e00-\u9fa5\·]{2,10})$/.test(name)) {
        return false;
    } else {
        return true;
    }
}
//身份证验证
export function cardIdPass(cardId) {
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(cardId)) {
        return false;
    } else {
        return true;
    }
}
//格式化数字金额
export function formatMoney(number) {
    let dataval = parseInt(number);
    let data2 = dataval
        .toFixed(2)
        .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    return data2;
}
//格式化银行卡号
export function formatBankCardId(bankCardId) {
    let dataval = parseInt(bankCardId);
    let data2 = dataval.replace(/(\d{4})(?=\d)/g, '$1 ')
    return data2;
}
export const isIOS = () => {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g 
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
    if (isIOS) {
        return true;
    } else {
        return false;
    }
}
//失焦恢复视口
export function leave() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}
// 格式化
export const formatJson = (data) => {

    if (!Array.isArray(data) || data.length <= 0) {
        return {}
    }
    let newdata = {}

    data.forEach(item => {
        newdata[item.itemCode] = item.defaultValue
    })
    return newdata;

}

export const imgPreview = (file) => {

    return new Promise((resolve, reject) => {
        let Orientation;

        //去获取拍照时的信息，解决拍出来的照片旋转问题  
        Exif.getData(file, function () {
            Orientation = Exif.getTag(this, 'Orientation');
        });
        // 看支持不支持FileReader  
        if (!file || !window.FileReader) {
            reject();
            return;
        }

        if (/^image/.test(file.type)) {
            // 创建一个reader  
            let reader = new FileReader();
            // 将图片2将转成 base64 格式  
            reader.readAsDataURL(file);
            // 读取成功后的回调  
            reader.onloadend = function () {
                let result = this.result;
                let img = new Image();
                img.src = result;
                //判断图片是否大于100K,是就直接上传，反之压缩图片  
                if (this.result.length <= (100 * 1024)) {
                    resolve(this.result);
                    return;
                } else {
                    img.onload = () => {
                        resolve(compress(img, Orientation));
                        return;
                    }
                }
            }
        }
    });

}

const tempKey = "tempDataSet";

export const storeSet = (value, key) => {
    if (!key) {
        store.set(tempKey, value);
    } else {
        const tempData = store.get(tempKey) || {};
        tempData[key] = value;
        store.set(tempKey, tempData);
    }
}

export const storeGet = (key) => {
    if (!key) {
        return store.get(tempKey) || {};
    } else {
        const tempData = store.get(tempKey);
        if (tempData) {
            return tempData[key];
        } else {
            return null;
        }
    }
}

export const storeRemove = (key) => {
    if (!key) {
        store.remove(tempKey);
    } else {
        const tempData = store.get(tempKey) || {};
        if (tempData[key]) {
            delete tempData[key];
            store.set(tempKey, tempData);
        }
    }
}

const rotateImg = (img, direction, canvas) => {
    //最小与最大旋转方向，图片旋转4次后回到原方向      
    const min_step = 0;
    const max_step = 3;
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错      
    let height = img.height;
    let width = img.width;
    let step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值      
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数      
    let degree = step * 90 * Math.PI / 180;
    let ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
};


const compress = (img, Orientation) => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //瓦片canvas  
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.width;
    let height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下  
    let ratio;
    if ((ratio = width * height / 4000000) > 1) {
        //大于400万像素
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //        铺底色  
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制  
    let count;
    if ((count = width * height / 1000000) > 1) {
        //超过100W像素
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片  
        //            计算每块瓦片的宽和高  
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0,
                    nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    //修复ios上传图片的时候 被旋转的问题  
    if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
            case 6: //需要顺时针（向左）90度旋转  
                rotateImg(img, 'left', canvas);
                break;
            case 8: //需要逆时针（向右）90度旋转  
                rotateImg(img, 'right', canvas);
                break;
            case 3: //需要180度旋转  
                rotateImg(img, 'right', canvas); //转两次  
                rotateImg(img, 'right', canvas);
                break;
        }
    }
    //进行最小压缩  
    let ndata = canvas.toDataURL('image/jpeg', 0.1);
    // console.log('压缩前：' + initSize);
    // console.log('压缩前：' + initSize / 1024 / 1024);
    // console.log('压缩后：' + ndata.length);
    // console.log('压缩后：' + ndata.length / 1024 / 1024);
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
};