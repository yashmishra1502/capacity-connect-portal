import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Award, Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/trainer/certificate")({
  head: () => ({
    meta: [{ title: "Certificates — Trainer Portal · Capacity Connect" }],
  }),
  component: CertificateGenerator,
});

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatDate(d: Date) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function CertificateGenerator() {
  const today = new Date();
  const [traineeName, setTraineeName] = useState("");
  const [program, setProgram] = useState("Capacity Connect Initiative");
  const [startDate, setStartDate] = useState(formatDate(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [place, setPlace] = useState("New Delhi");
  const [certNo, setCertNo] = useState(
    `CC/${today.getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [coordinatorName, setCoordinatorName] = useState("Kumar");
  const [trainerName, setTrainerName] = useState("Priya");
  const [signatoryName, setSignatoryName] = useState("Sharma");

  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    // Uses browser print-to-PDF as a dependency-free export path.
    window.print();
  };

  const displayName = traineeName.trim() || "Trainee Name";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Award className="size-5 text-primary" />
          Generate Certificate
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the trainee details — the certificate preview updates automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] print:block">
        {/* Form */}
        <Card className="print:hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Certificate Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="traineeName">Trainee Name</Label>
              <Input
                id="traineeName"
                placeholder="e.g. Dr. Rajesh Khurrana"
                value={traineeName}
                onChange={(e) => setTraineeName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="program">Program / Initiative</Label>
              <Input
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="certNo">Certificate No.</Label>
                <Input
                  id="certNo"
                  value={certNo}
                  onChange={(e) => setCertNo(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="coordinatorName">Coordinator</Label>
                <Input
                  id="coordinatorName"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="trainerName">Trainer</Label>
                <Input
                  id="trainerName"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signatoryName">Signatory</Label>
                <Input
                  id="signatoryName"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleDownload} className="flex-1 gap-2">
                <Download className="size-4" />
                Download
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2">
                <Printer className="size-4" />
                Print
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tip: "Download" opens your browser's print dialog — choose "Save as PDF" as the
              destination to get a certificate file.
            </p>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="overflow-auto rounded-lg border bg-muted/30 p-4 print:border-0 print:bg-white print:p-0">
          <div
            ref={certRef}
            id="certificate-print-area"
            className="mx-auto aspect-[870/612] w-full max-w-[900px] bg-white shadow-sm"
            style={{
              border: "10px solid #1a3a6b",
              padding: "6px",
              fontFamily: "'Times New Roman', Georgia, serif",
            }}
          >
            <div
              className="relative flex h-full w-full flex-col items-center px-10 py-6 text-center"
              style={{ border: "2px solid #d4af37" }}
            >
              {/* Top row: emblem */}
              <div className="flex w-full items-start justify-between">
                <div className="text-left text-[10px] font-bold leading-tight text-emerald-700">
                  G20<br />
                  <span className="text-[9px] font-normal text-slate-500">भारत 2023 INDIA</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 100 100" className="size-12">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#b8860b" strokeWidth="2" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 42 * Math.cos((i * Math.PI) / 12)}
                        y2={50 + 42 * Math.sin((i * Math.PI) / 12)}
                        stroke="#b8860b"
                        strokeWidth="0.8"
                      />
                    ))}
                    <circle cx="50" cy="50" r="8" fill="#b8860b" />
                  </svg>
                </div>
                <div className="text-right text-[9px] font-semibold leading-tight text-orange-600">
                  75<br />
                  <span className="text-[8px]">आज़ादी का<br />अमृत महोत्सव</span>
                </div>
              </div>

              <p className="mt-1 text-[11px] font-semibold tracking-wide text-emerald-800">
                भारत सरकार
              </p>
              <p className="text-[11px] font-semibold tracking-wide text-emerald-800">
                GOVERNMENT OF INDIA
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-wide text-blue-900">
                CAPACITY BUILDING &amp; SKILL DEVELOPMENT INITIATIVE
              </h2>

              <div className="my-2 h-px w-2/3 bg-amber-500" />

              <div className="relative flex w-full items-center justify-center">
                <div className="absolute left-2 flex flex-col items-center text-[7px] font-semibold leading-tight text-blue-800">
                  <div className="mb-1 flex size-12 items-center justify-center rounded-full border-2 border-blue-800">
                    <Award className="size-5" />
                  </div>
                  CAPACITY<br />CONNECT
                </div>
                <h1 className="text-2xl font-bold tracking-wide text-red-800">
                  CERTIFICATE OF APPRECIATION
                </h1>
                <div className="absolute right-2 flex flex-col items-center text-[7px] font-semibold leading-tight text-blue-800">
                  <div className="mb-1 flex size-12 items-center justify-center rounded-full border-2 border-blue-800">
                    <Award className="size-5" />
                  </div>
                  SKILLING<br />INDIA
                </div>
              </div>

              <div className="mt-2 rounded bg-blue-900 px-4 py-1 text-[11px] font-semibold tracking-wide text-white">
                THIS CERTIFICATE IS PROUDLY PRESENTED TO
              </div>

              <p
                className="mt-4 text-3xl text-blue-800"
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                {displayName}
              </p>
              <div className="mt-1 h-px w-1/2 border-b border-dashed border-slate-400" />

              <p className="mt-4 max-w-xl text-[12px] leading-relaxed text-slate-700">
                for successfully completing the Training Program as a Trainee under the{" "}
                <span className="font-semibold text-red-700">{program}</span>
                <br />
                conducted from{" "}
                <span className="font-semibold underline underline-offset-2">{startDate}</span>{" "}
                to <span className="font-semibold underline underline-offset-2">{endDate}</span>.
              </p>

              <p className="mt-3 max-w-xl text-[11px] leading-relaxed text-blue-800">
                He / She has shown keen interest, active participation and dedication throughout
                the training period.
                <br />
                We appreciate his / her efforts and wish him / her all the best for a bright
                future.
              </p>

              <div className="mt-auto flex w-full items-end justify-between pt-6">
                <div className="text-left text-[10px] text-slate-600">
                  <p>
                    <span className="font-semibold">Certificate No. :</span> {certNo}
                  </p>
                  <p>
                    <span className="font-semibold">Date :</span> {endDate}
                  </p>
                  <p>
                    <span className="font-semibold">Place :</span> {place}
                  </p>
                </div>

                <div className="flex gap-10 text-center text-[9px] text-slate-600">
                  <div>
                    <div
                      className="mb-1 flex h-8 w-20 items-end justify-center border-b border-slate-400 text-lg text-blue-700"
                      style={{ fontFamily: "'Brush Script MT', cursive" }}
                    >
                      {coordinatorName}
                    </div>
                    Programme Coordinator
                  </div>
                  <div>
                    <div
                      className="mb-1 flex h-8 w-20 items-end justify-center border-b border-slate-400 text-lg text-blue-700"
                      style={{ fontFamily: "'Brush Script MT', cursive" }}
                    >
                      {trainerName}
                    </div>
                    Trainer
                  </div>
                  <div>
                    <div
                      className="mb-1 flex h-8 w-20 items-end justify-center border-b border-slate-400 text-lg text-green-700"
                      style={{ fontFamily: "'Brush Script MT', cursive" }}
                    >
                      {signatoryName}
                    </div>
                    Authorised Signatory
                  </div>
                </div>
              </div>

              <p className="mt-2 text-[9px] font-semibold text-blue-900">
                MINISTRY OF SKILL DEVELOPMENT &amp; ENTREPRENEURSHIP · GOVERNMENT OF INDIA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
