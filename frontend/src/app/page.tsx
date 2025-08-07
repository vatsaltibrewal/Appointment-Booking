import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Wundrsight Clinic</h1>
      <p className="text-lg text-gray-400 mb-8">Your health, our priority. Book your appointment seamlessly.</p>
      <div>
        <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Book an Appointment
        </Link>
      </div>
    </div>
  );
}