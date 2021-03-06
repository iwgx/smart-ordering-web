import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt';
import Swal from 'sweetalert2'

function App() {
  const [form, setForm] = useState({
    // host: "wss://202.148.1.57:1883",
    // host: "http://202.148.1.57:8280",
    host: "mqtt://202.148.1.57:1883",
    username: "app-smartorderingsystem",
    password: "G4zwVj1B1qmTDR2V0oY7y2YVqUUe6o"
  })
  const [client, setClient] = useState<null | mqtt.MqttClient>(null);
  const [connectStatus, setConnectStatus] = useState("Not Connected")
  const [payload, setPayload] = useState({})
  
  const mqttConnect = () => {
    setConnectStatus('Connecting');
    try {
      setClient(mqtt.connect(form.host, {
        username: form.username,
        password: form.password,
      }));
    } catch (error) {
      setConnectStatus('Error');
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try Again'
      })
    }
  };

  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const actionSubmitMqttCredentials = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mqttConnect()
  }

  const renderNoticeText = () => {
    if (connectStatus === "Connected") {
      return "Anda sudah terhubung. Silakan menunggu pesanan masuk."
    } else if (connectStatus === "Not Connected") {
      return "Silakan mengisi MQTT Credential agar bisa melihat pesanan yang masuk."
    } else if (connectStatus === "Error") {
      return "Terjadi kesalahan. Silakan coba lagi."
    }
  }

  console.log(connectStatus)

  return (
    <div className="flex flex-col min-h-screen">
      <header className=" bg-gray-100">
        <div className="container mx-auto flex pt-8 pb-2 lg:py-8 px-8 lg:px-0">
          <h1 className="text-xl">
            Smart Ordering
          </h1>
        </div>
      </header>
      <main className="bg-gray-100 flex-1">
        <div className="container mx-auto flex flex-col lg:flex-row py-8 px-8 lg:px-0">
          <form className="flex flex-col items-center bg-white px-4 py-4 rounded-md shadow-lg lg:w-96" onSubmit={actionSubmitMqttCredentials}>
            <h2 className="text-2xl text-center">MQTT Credential</h2>
            <input value={form.host} onChange={event => setForm({ ...form, host: event.target.value})} type="text" placeholder="host" className="border rounded-md p-2 w-full mt-4" />
            <input value={form.username} onChange={event => setForm({ ...form, username: event.target.value})} type="text" placeholder="username" className="border rounded-md p-2 w-full mt-4" />
            <input value={form.password} onChange={event => setForm({ ...form, password: event.target.value})} type="password" placeholder="password" className="border rounded-md p-2 w-full mt-4" />
            <button className="bg-blue-500 rounded-md text-white p-2 w-full mt-4">Submit</button>
          </form>
          <div className="lg:ml-8 mt-8 lg:mt-0 w-full">
            <div className="px-6 py-4 bg-white rounded-lg shadow-lg">
              <span className="font-bold">{ connectStatus }</span> 
              { renderNoticeText()
                ? <p className="mt-2">
                    { renderNoticeText() }
                  </p>
                : null
              }
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800">
        <div className="container mx-auto text-white py-8 px-12 text-center">
          &copy; 2021 Ilham Wahabi & Kevin Fernaldy
        </div>
      </footer>
    </div>
  )
}

export default App
