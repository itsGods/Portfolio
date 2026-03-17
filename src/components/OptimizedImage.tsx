interface OptimizedImageProps {
  src: string
  webpSrc?: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  sizes?: string
}

export const OptimizedImage = ({
  src, webpSrc, alt, width, height, 
  priority = false, className, sizes
}: OptimizedImageProps) => (
  <picture>
    {webpSrc && (
      <source srcSet={webpSrc} type="image/webp" 
              sizes={sizes} />
    )}
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={{ objectFit: 'cover' }}
    />
  </picture>
)
