export async function uploadImage(file: File): Promise<string> {
  const r = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  if (!r.ok) throw new Error((await r.json()).error ?? "Could not start upload");
  const { uploadUrl, publicUrl } = await r.json();

  const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!put.ok) throw new Error("Upload failed");
  return publicUrl;
}