import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/mdx';

// Use Node runtime instead of Edge to access file system
export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #171717, #262626)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 60, color: '#e5e5e5' }}>Post Not Found</div>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Tags */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          {post.tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              style={{
                background: '#2e2e2e',
                color: '#a3a3a3',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '20px',
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#e5e5e5',
            lineHeight: 1.2,
            marginBottom: '30px',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {post.title}
        </div>

        {/* Excerpt */}
        <div
          style={{
            fontSize: '28px',
            color: '#a3a3a3',
            lineHeight: 1.4,
            marginBottom: 'auto',
            display: 'flex',
          }}
        >
          {post.excerpt.slice(0, 150)}
          {post.excerpt.length > 150 ? '...' : ''}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingTop: '40px',
            borderTop: '2px solid #2e2e2e',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#f5f5f5',
              display: 'flex',
            }}
          >
            Elvis O. Amoako
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#6b6b6b',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span>{post.readTime}</span>
            <span>•</span>
            <span>elviis.tech</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
