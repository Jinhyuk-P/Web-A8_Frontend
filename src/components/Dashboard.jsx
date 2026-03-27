import { Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ 
        p: 4, 
        mt: 5, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <iframe 
        width="100%" 
        height="400" 
        style={{ maxWidth: '600px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        src="https://www.youtube.com/embed/4H0Ytxg4-kQ" 
        title="All For Us - Labrinth" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>

      <a 
        href="https://music.youtube.com/watch?v=4H0Ytxg4-kQ&si=ScJwCMtFdWdrcS3d" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
            color: '#2196f3', 
            marginTop: '25px', 
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold'
        }}
      >
        Escuchar en YouTube Music
      </a>
    </Box>
  );
}