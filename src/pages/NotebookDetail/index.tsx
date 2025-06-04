import React from 'react';
import { useParams, useLocation } from 'wouter';
import { FreeDetail } from './FreeDetail';
import { PersonalDetail } from './PersonalDetail';

export const NotebookDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = params.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-base text-text pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red mb-4">Notebook Not Found</h1>
          <p className="text-subtext1 mb-6">The requested notebook could not be found.</p>
          <button
            onClick={() => setLocation('/notebooks')}
            className="px-6 py-3 bg-blue hover:bg-blue/90 text-base rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Route based on ID prefix
  if (id.startsWith('free-')) {
    return <FreeDetail notebookId={id} />;
  } else if (id.startsWith('your-')) {
    return <PersonalDetail notebookId={id} />;
  } else {
    return (
      <div className="min-h-screen bg-base text-text pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red mb-4">Invalid Notebook Type</h1>
          <p className="text-subtext1 mb-6">
            Notebook ID should start with either "free-" or "your-".
          </p>
          <button
            onClick={() => setLocation('/notebooks')}
            className="px-6 py-3 bg-blue hover:bg-blue/90 text-base rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
}; 
