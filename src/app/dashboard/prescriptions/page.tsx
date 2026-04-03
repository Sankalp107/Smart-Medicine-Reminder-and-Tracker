"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Trash2, Eye, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface Prescription {
  name: string;
  url: string;
  uploadedAt: string;
}

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("prescriptions").upload(fileName, file);

    if (!error) {
      const { data } = supabase.storage.from("prescriptions").getPublicUrl(fileName);
      setPrescriptions([...prescriptions, {
        name: file.name,
        url: data.publicUrl,
        uploadedAt: new Date().toISOString(),
      }]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-lg font-bold text-foreground">Prescriptions</h1>

      {/* Upload area */}
      <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
        <Upload className={`w-6 h-6 ${uploading ? "animate-bounce text-primary" : "text-muted-foreground"}`} />
        <span className="text-xs font-medium text-foreground">
          {uploading ? "Uploading..." : "Click to upload prescription"}
        </span>
        <span className="text-[10px] text-muted-foreground">PDF, JPG, PNG — Max 5MB</span>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {/* List */}
      {prescriptions.length === 0 ? (
        <div className="text-center py-8 bg-card border border-border rounded-xl">
          <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">No prescriptions uploaded</p>
          <p className="text-xs text-muted-foreground mt-1">Upload an image or PDF of your prescription.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {prescriptions.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(p.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a href={p.url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <Eye className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => setPrescriptions(prescriptions.filter((_, j) => j !== i))} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
