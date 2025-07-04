
import React from 'react';

const SocialShare = ({ event }) => {
  const handleSocialShare = (platform) => {
    const eventUrl = window.location.href;
    const eventTitle = encodeURIComponent(event.title);
    const eventDescription = encodeURIComponent(event.description);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${eventUrl}&text=${eventTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${eventTitle}%20${eventUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${eventTitle}&body=${eventDescription}%20${eventUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyEventLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Event link copied to clipboard!');
  };

  return (
    <div className="social-sharing" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem' }}>
        {!event.isPublic ? 'Share this private event' : 'Share your event'}
      </h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button 
          onClick={() => handleSocialShare('facebook')}
          className="share-btn"
          style={{ 
            backgroundColor: '#4267B2', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          📘 Facebook
        </button>
        <button 
          onClick={() => handleSocialShare('twitter')}
          className="share-btn"
          style={{ 
            backgroundColor: '#1DA1F2', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🐦 Twitter
        </button>
        <button 
          onClick={() => handleSocialShare('linkedin')}
          className="share-btn"
          style={{ 
            backgroundColor: '#0077B5', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          💼 LinkedIn
        </button>
        <button 
          onClick={() => handleSocialShare('whatsapp')}
          className="share-btn"
          style={{ 
            backgroundColor: '#25D366', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          📱 WhatsApp
        </button>
        <button 
          onClick={() => handleSocialShare('email')}
          className="share-btn"
          style={{ 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          📧 Email
        </button>
        <button 
          onClick={copyEventLink}
          className="share-btn"
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔗 Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
