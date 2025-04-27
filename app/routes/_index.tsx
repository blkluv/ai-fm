import type {MetaFunction} from "@remix-run/node";
import {Link} from "@remix-run/react";
import {Button, Card, CardBody, CardFooter, CardHeader} from "@heroui/react";

export const meta: MetaFunction = () => {
  return [
    {title: "Non-stop pop FM"},
    {name: "description", content: "AI-generated radio with real songs and AI moderator voiceovers"},
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      
      <div className="max-w-5xl w-full flex flex-col items-center gap-12 mt-20">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
            Non-stop pop FM
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
            Experience the future of radio with AI-generated moderator voiceovers and your favorite music
          </p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">AI-Powered Radio Experience</h2>
            <p className="text-gray-600">Real songs. AI moderators. Non-stop entertainment.</p>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Curated playlists of real songs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> AI-generated moderator voiceovers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Personalized radio experience
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> Create your own custom stations
              </li>
            </ul>
          </CardBody>
          <CardFooter>
            <Link to="/radio/1" className="w-full">
              <Button 
                className="w-full bg-blue-500 text-white font-medium py-6"
                size="lg"
              >
                Start Listening Now
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="shadow-sm">
            <CardBody className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Real Music</h3>
              <p className="text-gray-600">Listen to your favorite songs in curated playlists</p>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Moderators</h3>
              <p className="text-gray-600">Enjoy entertaining AI-generated voiceovers between tracks</p>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Non-Stop</h3>
              <p className="text-gray-600">Continuous entertainment that adapts to your preferences</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <footer className="mt-16 text-gray-500 text-center">
        <p>© 2025 Non-stop pop FM. All rights reserved.</p>
      </footer>
    </div>
  );
}
