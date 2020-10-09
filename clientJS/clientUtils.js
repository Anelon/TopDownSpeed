let imagesLoading = 0;
let loadingCallBack = null;

export function setLoadingCallback(callback) {
    loadingCallBack = callback;
}

export function startedImageLoad() {
    imagesLoading++;
}

export function endedImageLoad() {
    imagesLoading--;
    if(imagesLoading === 0) {
        if(loadingCallBack) loadingCallBack();
    }
}