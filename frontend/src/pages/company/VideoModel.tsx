import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VideoModel() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runModel = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("http://localhost:8000/ai/video-player", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Video processing failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Video Model</h1>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <input
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />

          <Button onClick={runModel} disabled={!file || loading}>
            {loading ? "Processing video…" : "Run Video Model"}
          </Button>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Detection Result</CardTitle>
          </CardHeader>
          <CardContent>
            <video
              src={videoUrl}
              controls
  className="rounded-lg border max-h-[420px] w-auto mx-auto aspect-video"            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
