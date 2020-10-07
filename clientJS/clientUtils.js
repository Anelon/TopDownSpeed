let imagesLoading = 0;
let loadingCallBack = null;

export function setLoadingCallback(callback) {
    loadingCallBack = callback;
}

export function startedImageLoad() {
    imagesLoading++;
    console.log(imagesLoading);
}

export function endedImageLoad() {
    imagesLoading--;
    console.log(imagesLoading);
    if(imagesLoading === 0) {
        if(loadingCallBack) loadingCallBack();
    }
}