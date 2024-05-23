import React from 'react';
import axios from 'axios';
import { useUser } from '../../../Layout/assets/usercontext';

const API = process.env.API || 'http://localhost:4000';

const DownloadUserInfo = ({ targetType, target, token }) => {
  const handleDownload = async () => {
    if (!target) {
        return false
    }
    else {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include JWT token for authorization
      },
      responseType: 'blob', // Expecting a downloadable file
    };

    try {
      const response = await axios.get(
        `${API}/owner/user/download`, // Endpoint to download user information
        {
          params: {
            [targetType === 'email' ? 'email' : 'username']: target,
          },
          ...config,
        }
      );

      if (response.status === 200) {
        // Create a Blob URL for the downloaded data
        const blob = new Blob([response.data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);

        // Create a hidden anchor tag to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_info.txt'; // Suggested download filename
        a.click(); // Trigger the download

        // Clean up Blob URL after download
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading user information:', error);
    }
}
  };

  return (
    <button onClick={handleDownload}>Download User Info</button>
  );
};

export default DownloadUserInfo;
