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
        public List<Reservation> reservations = new List<Reservation>();
        public Form1()
        {
            InitializeComponent();

            ConnectionMultiplexer redisConnection = ConnectionMultiplexer.Connect("178.149.200.244:6379");
            db = redisConnection.GetDatabase();
            sub = redisConnection.GetSubscriber();

            sub.Subscribe("reservations", (channel, message) =>
            {
                var reservation = JsonConvert.DeserializeObject<Reservation>(message);
                reservations.Add(new Reservation(reservation.seatsId, reservation.userId, false));
            });
        }

        private void Button1_Click_1(object sender, EventArgs e)
        {
            if(reservations.Count > 0)
            {
                if (this.checkBox1.Checked == true)
                    reservations[0].accepted = true;
                else
                    reservations[0].accepted = false;

                sub.Publish("reservationsResponse", JsonConvert.SerializeObject(reservations[0]));
                reservations.RemoveAt(0);
            }
        }
    }
}
