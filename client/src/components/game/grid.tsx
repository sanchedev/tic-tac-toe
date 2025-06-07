import GridCell from './grid-cell'

export default function Grid() {
  return (
    <main className='grid grid-cols-3 aspect-square [&>div]:size-32'>
      <div className='border-b border-r p-4'>
        <GridCell x={0} y={0} />
      </div>
      <div className='border-l border-b border-r p-4'>
        <GridCell x={1} y={0} />
      </div>
      <div className='border-l border-b p-4'>
        <GridCell x={2} y={0} />
      </div>
      <div className='border-t border-b border-r p-4'>
        <GridCell x={0} y={1} />
      </div>
      <div className='border-t border-l border-b border-r p-4'>
        <GridCell x={1} y={1} />
      </div>
      <div className='border-t border-l border-b p-4'>
        <GridCell x={2} y={1} />
      </div>
      <div className='border-t border-r p-4'>
        <GridCell x={0} y={2} />
      </div>
      <div className='border-t border-l border-r p-4'>
        <GridCell x={1} y={2} />
      </div>
      <div className='border-t border-l p-4'>
        <GridCell x={2} y={2} />
      </div>
    </main>
  )
}
