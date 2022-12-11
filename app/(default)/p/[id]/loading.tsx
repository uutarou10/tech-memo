const ArticleLoading = () => {
  return (
    <div className={'flex gap-2 justify-center py-8'}>
      <div className={'w-3 h-3 rounded-full bg-gray-400 animate-bounce'} />
      <div
        className={'w-3 h-3 rounded-full bg-gray-400 animate-bounce'}
        style={{ animationDelay: '300ms' }}
      />
      <div
        className={'w-3 h-3 rounded-full bg-gray-400 animate-bounce'}
        style={{ animationDelay: '600ms' }}
      />
    </div>
  )
}

export default ArticleLoading
