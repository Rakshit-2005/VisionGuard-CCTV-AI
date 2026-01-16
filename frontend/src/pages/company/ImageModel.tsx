import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Detection = {
    label: string;
    confidence: number;
};

type Summary = {
    class: string;
    count: number;
    avg_confidence: number;
};

export default function ImageModel() {
    const [file, setFile] = useState<File | null>(null);
    const [output, setOutput] = useState<string | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [summary, setSummary] = useState<Summary[]>([]);
    const [totalDetections, setTotalDetections] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runModel = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setOutput(null);
        setDetections([]);
        setSummary([]);
        setTotalDetections(0);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch("http://localhost:8000/ai/image-infer", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Inference failed");
            }

            // ✅ READ HEADERS FIRST
            const detectionsHeader = res.headers.get("X-Detections");
            const summaryHeader = res.headers.get("X-Summary");
            const totalHeader = res.headers.get("X-Total-Detections");

            // ✅ THEN read the image
            const blob = await res.blob();
            const imageUrl = URL.createObjectURL(blob);

            setOutput(imageUrl);

            if (detectionsHeader) setDetections(JSON.parse(detectionsHeader));
            if (summaryHeader) setSummary(JSON.parse(summaryHeader));
            if (totalHeader) setTotalDetections(Number(totalHeader));

            if (detectionsHeader) {
                setDetections(JSON.parse(detectionsHeader));
            }
            if (summaryHeader) {
                setSummary(JSON.parse(summaryHeader));
            }
            if (totalHeader) {
                setTotalDetections(Number(totalHeader));
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Image Model</h1>
                <p className="text-sm text-muted-foreground">
                    Upload an image to detect PPE and safety violations
                </p>
            </div>

            {/* Upload */}
            <Card>
                <CardContent className="space-y-4 pt-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                    />

                    <Button onClick={runModel} disabled={!file || loading}>
                        {loading ? 'Running model…' : 'Run Image Model'}
                    </Button>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </CardContent>
            </Card>

            {/* Output */}
            {output && (
                <Card>
                    <CardHeader>
                        <CardTitle>Detection Result</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Total detections: {totalDetections}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Image */}
                        <img
                            src={output}
                            alt="Model Output"
                            className="rounded-lg border max-w-full"
                        />

                        {/* Save */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = output;
                                a.download = 'prediction.jpg';
                                a.click();
                            }}
                        >
                            Save Annotated Image
                        </Button>

                        {/* Class-wise summary */}
                        {summary.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Detected Objects</h3>
                                <ul className="text-sm space-y-1">
                                    {summary.map((s, i) => (
                                        <li key={i}>
                                            • {s.class}: {s.count} (
                                            avg confidence {(s.avg_confidence * 100).toFixed(1)}%)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Raw detections (optional, detailed) */}
                        {detections.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">All Detections</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                    {detections.map((d, i) => (
                                        <div
                                            key={i}
                                            className="border rounded-md px-3 py-2"
                                        >
                                            {d.label}
                                            <span className="block text-muted-foreground text-xs">
                                                {(d.confidence * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
