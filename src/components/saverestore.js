import * as React from "react"
import styled from "styled-components"
import Button from "components/button"

const FileDownloadDialog = styled.div`
    display: none;
    margin: 6px 12px;
    padding: 6px 6px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    &.active{
        display: block;
    }
`

const FileUploadDialog = styled.div`
    display: none;
    margin: 6px 12px;
    padding: 6px 6px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    &.active{
        display: block;
    }
`

const FileName = styled.input`
    -webkit-appearance: none;
    margin: 6px;
    padding: 0 6px;
    outline-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`outline-color: ${theme.dark.textColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
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
    border: 2px solid;
    border-radius: 5px;
    border-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.textColor};`}
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    margin: 6px;
    width: 120px;
    &:hover {
        color: ${({theme}) => theme.light.buttonText};
        ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
        border-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`border-color: ${theme.dark.buttonBackground};`}
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        font-weight: 700;
        opacity: 0.8;
    }
`

const SaveRestore = ({extn,save,restore,savetitle,restoretitle}) => {
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
        setFileURL(blob)
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
            restore(reader.result,file.name)
        }
        if(file !== null) {
            reader.readAsText(file)
            toggleUploadDialog()
        }
    }
    React.useEffect(() => {
        if(save)
            fileLink.current.click()
        return () => {
            URL.revokeObjectURL(fileURL)
            setFileURL(null)    
        }
    },[fileURL,save])
    React.useEffect(() => {
        if(visibleDL)
            fileNameRef.current.focus()
    },[visibleDL])
    let activeDL = visibleDL ? "active" : ""
    let activeUL = visibleUL ? "active" : ""
    return (
        <>
            {save && <Button onClick={toggleDownloadDialog}>{savetitle || 'Save'}</Button>}
            {restore && <Button onClick={toggleUploadDialog}>{restoretitle || 'Restore'}</Button>}
            {save && <FileDownloadDialog className={activeDL}>
                <label htmlFor={`snapshotDL${extn}`}><strong>Name File ►</strong></label>
                <FileName id={`snapshotDL${extn}`} type="text" placeholder="snapshot" ref={fileNameRef} onChange={(e) => updateFilenameDL(e.target.value)}></FileName>
                <Button onClick={download}>Download</Button>
                <Button onClick={toggleDownloadDialog}>Cancel</Button>
                <FileAnchor download={`${filenameDL.replace(/ /g,'-') || 'snapshot'}.${extn}`} href={fileURL} ref={fileLink}>snapshot</FileAnchor>
            </FileDownloadDialog>}
            {restore && <FileUploadDialog className={activeUL}>
                <label htmlFor={`snapshotUL${extn}`}>
                    <strong>{filenameUL || 'Select File ►'}</strong>
                    <FileBrowser>Browse</FileBrowser>
                </label>
                <FileInput id={`snapshotUL${extn}`} type="file" accept={`.${extn}`} onClick={e => (e.target.value = null)} onChange={(e) => handleFileUpload(e)}></FileInput>
                <Button onClick={upload}>Upload</Button>
                <Button onClick={toggleUploadDialog}>Cancel</Button>
            </FileUploadDialog>}
        </>
    )   
}

export default SaveRestore