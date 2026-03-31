import pdfIcon from '@/assets/pdf.png';
import imgIcon from '@assets/image.png'

const fileIcons = {
  'application/pdf': pdfIcon,
  'image/png': imgIcon,
  'image/jpg': imgIcon,
  'image/jpeg': imgIcon,
}

const FileDisplayer = ({ content } : { content : FileList } ) => {
  return (
    <div className="file-displayer">
      <h3>{content.length} files</h3>
      {
        [...content].map((file: File, i: number) => {
          const { name, type, size } = file
          const img = fileIcons[type as keyof typeof fileIcons]
          return(
            <div 
              key={i+name}
              className="file-displayer__record"
            >
              <img src={img} height={20} width={20} alt={type} />
              <p>{name} - {Math.ceil(size/1000)}kb</p>
            </div>
          )
        })

      }
    </div>
  )
}

export default FileDisplayer;