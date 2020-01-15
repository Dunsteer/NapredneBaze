using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using StackExchange.Redis;
using Newtonsoft.Json;

namespace FlightsBooking
{
    public partial class Form1 : Form
    {
        public IDatabase db;
        public ISubscriber sub;
        public int reservationStatus = 0;
        public Form1()
        {
            InitializeComponent();

            ConnectionMultiplexer redisConnection = ConnectionMultiplexer.Connect("178.149.200.244:6379");
            db = redisConnection.GetDatabase();
            sub = redisConnection.GetSubscriber();

            sub.Subscribe("reservations", (channel, message) =>
            {
                var reservation = JsonConvert.DeserializeObject<Reservation>(message);
                if (reservationStatus % 2 == 0)
                    reservation.accepted = true;
                else
                    reservation.accepted = false;

                reservationStatus++;

                sub.Publish("reservationsResponse", JsonConvert.SerializeObject(reservation));
            });
        }

        private void Button1_Click(object sender, EventArgs e)
        {
            sub.Publish("reservationsResponse", "{'greeting': 'hello'}");
        }
    }
}
