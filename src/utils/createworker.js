const createWorker = (workerFunction) => {
    let functionBlob = new Blob([`onmessage = `, workerFunction.toString()], {type: 'text/javascript'})
    let functionURL = URL.createObjectURL(functionBlob)

    return new window.Worker(functionURL)
}

export default createWorker