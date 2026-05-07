export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-12">
      <h1>Company Detail Page for ID: {params.id}</h1>
    </div>
  );
}
