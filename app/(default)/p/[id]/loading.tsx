const ArticleLoading = () => {
  return (
    <div className={'flex justify-center gap-2 py-8'}>
      <div className={'h-3 w-3 animate-bounce rounded-full bg-gray-400'} />
      <div
        className={'h-3 w-3 animate-bounce rounded-full bg-gray-400'}
        style={{ animationDelay: '300ms' }}
      />
      <div
        className={'h-3 w-3 animate-bounce rounded-full bg-gray-400'}
        style={{ animationDelay: '600ms' }}
      />
    </div>
  )
}

export default ArticleLoading
