interface ContainerProps{
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({children}) => {
  return (
    <div className="max-w-[1440px] mx-auto xl:px-5 md:px-2  px-1">
        {children}
        
    </div>
  )
}

export default Container