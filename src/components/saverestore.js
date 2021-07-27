import * as React from "react"
import styled from "styled-components"
import Button from "./button"

const FileDownloadDialog = styled.div`
    display: none;
    margin: 6px 12px;
    padding: 6px 6px;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    &.active{
        display: block;
    }
`

const FileUploadDialog = styled.div`
    display: none;
    margin: 6px 12px;
    padding: 6px 6px;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    &.active{
        display: block;
    }
`

const FileName = styled.input`
    -webkit-appearance: none;
    margin: 6px;
    padding: 0 6px;
    outline-color: #333366;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    width: 120px;
`

const FileAnchor = styled.a`
    display: none;
`

const FileInput = styled.input`
    display: none;
`

const FileBrowser = styled.div`
    display: inline-block;
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: 6px;
    width: 120px;
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
    }
    &.active {
        border: 2px solid #333366;
    }
`

const SaveRestore = ({extn,save,restore}) => {
    const [visibleDL, setDLVisibility] = React.useState(false)
    const [visibleUL, setULVisibility] = React.useState(false)
    const [fileURL,setFileURL] = React.useState(null)
    const [fileOBJ,setFileOBJ] = React.useState(null)
    const [filenameDL,updateFilenameDL] = React.useState("")
    const [filenameUL,updateFilenameUL] = React.useState("")
    const fileLink = React.useRef(null)
    const fileNameRef = React.useRef(null)
    const toggleDownloadDialog = () => {
        setDLVisibility(!visibleDL)
        if(visibleUL)
            setULVisibility(false)
    }
    const toggleUploadDialog = () => {
        if(visibleUL) {
            updateFilenameUL("")
            setFileOBJ(null)
        }
        setULVisibility(!visibleUL)
        if(visibleDL)
            setDLVisibility(false)
    }
    const download = () => {
        let blob = save()
        if(blob === null) {
            toggleDownloadDialog()
            return
        }
        let file = new Blob([blob], {type: 'text/plain'})
        setFileURL(URL.createObjectURL(file))
        toggleDownloadDialog()
    }
    const handleFileUpload = (event) => {
        let file = event.target.files[0]
        updateFilenameUL(file.name)
        setFileOBJ(file)
    }
    const upload = () => {
        let file = fileOBJ
        let reader = new FileReader()
        reader.onload = () => {
            restore(reader.result)
        }
        if(file !== null) {
            reader.readAsText(file)
            toggleUploadDialog()
        }
    }
    React.useEffect(() => {
        fileLink.current.click()
        return () => {
            URL.revokeObjectURL(fileURL)
            setFileURL(null)    
        }
    },[fileURL])
    React.useEffect(() => {
        if(visibleDL)
            fileNameRef.current.focus()
    },[visibleDL])
    let activeDL = visibleDL ? "active" : ""
    let activeUL = visibleUL ? "active" : ""
    return (
        <>
            <Button onClick={toggleDownloadDialog}>Save</Button>
            <Button onClick={toggleUploadDialog}>Restore</Button>
            <FileDownloadDialog className={activeDL}>
                <label htmlFor={`snapshotDL${extn}`}><strong>Name File ►</strong></label>
                <FileName id={`snapshotDL${extn}`} type="text" placeholder="snapshot" ref={fileNameRef} onChange={(e) => updateFilenameDL(e.target.value)}></FileName>
                <Button onClick={download}>Download</Button>
                <Button onClick={toggleDownloadDialog}>Cancel</Button>
                <FileAnchor download={`${filenameDL.replace(/ /g,'-') || 'snapshot'}.${extn}`} href={fileURL} ref={fileLink}>snapshot</FileAnchor>
            </FileDownloadDialog>
            <FileUploadDialog className={activeUL}>
                <label htmlFor={`snapshotUL${extn}`}>
                    <strong>{filenameUL || 'Select File ►'}</strong>
                    <FileBrowser className={activeUL}>
                        Browse
                    </FileBrowser>
                </label>
                <FileInput id={`snapshotUL${extn}`} type="file" accept={`.${extn}`} onClick={e => (e.target.value = null)} onChange={(e) => handleFileUpload(e)}></FileInput>
                <Button onClick={upload}>Upload</Button>
                <Button onClick={toggleUploadDialog}>Cancel</Button>
            </FileUploadDialog>
        </>
    )   
}

export default SaveRestore