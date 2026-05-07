export default function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-12">
      <h1>Job Detail Page for ID: {params.id}</h1>
    </div>
  );
}
