const sampleListings = [
	{
		title: "Cozy Beachfront Cottage",
		description:
			"Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
		image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1500,
		location: "Malibu",
		country: "United States"
	},
	{
		title: "Modern Loft in Downtown",
		description:
			"Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
		image: "https://images.unsplash.com/photo-1524635962361-d7f5d5ff37ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1200,
		location: "New York City",
		country: "United States"
	},
	{
		title: "Mountain Retreat",
		description:
			"Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
		image: "https://images.unsplash.com/photo-1517638851339-4cf9f01d741d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1000,
		location: "Aspen",
		country: "United States"
	},
	{
		title: "Lakefront Cottage",
		description: "Charming lakefront cottage with breathtaking sunset views.",
		image: "https://images.unsplash.com/photo-1512914890252-2b9b5d0aef97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 900,
		location: "Lake Tahoe",
		country: "United States"
	},
	{
		title: "Rustic Farmhouse",
		description: "A cozy farmhouse surrounded by lush greenery and peace.",
		image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 750,
		location: "Nashville",
		country: "United States"
	},
	{
		title: "Luxury Villa",
		description: "Exclusive villa with private pool and stunning ocean views.",
		image: "https://images.unsplash.com/photo-1519923041758-44e17c71b6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 5000,
		location: "Santorini",
		country: "Greece"
	},
	{
		title: "Modern Penthouse",
		description: "Elegant penthouse with skyline views and premium amenities.",
		image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 2200,
		location: "Dubai",
		country: "UAE"
	},
	{
		title: "Tropical Bungalow",
		description: "Stay in this serene bungalow surrounded by palm trees.",
		image: "https://images.unsplash.com/photo-1556968738-17f30d110824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1300,
		location: "Bali",
		country: "Indonesia"
	},
	{
		title: "Countryside Cottage",
		description: "Peaceful countryside cottage with beautiful garden views.",
		image: "https://images.unsplash.com/photo-1505692957450-35adbe229d07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 800,
		location: "Oxford",
		country: "United Kingdom"
	},
	{
		title: "Chic City Apartment",
		description: "Compact and stylish apartment in the heart of the city.",
		image: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1500,
		location: "Paris",
		country: "France"
	},
	{
		title: "Historical Townhouse",
		description: "Experience history in this beautifully restored townhouse.",
		image: "https://images.unsplash.com/photo-1595265851715-05c4c8913f56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1800,
		location: "Edinburgh",
		country: "United Kingdom"
	},
	{
		title: "Beachfront Villa",
		description: "Stunning villa located directly on the sandy beach.",
		image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 4500,
		location: "Mykonos",
		country: "Greece"
	},
	{
		title: "Eco-Friendly Retreat",
		description: "Stay sustainably in this eco-friendly cabin.",
		image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 950,
		location: "Portland",
		country: "United States"
	},
	{
		title: "Ski Lodge",
		description: "Perfect for winter enthusiasts, this lodge is near ski slopes.",
		image: "https://images.unsplash.com/photo-1518432038638-6f02a17dd13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 2000,
		location: "Whistler",
		country: "Canada"
	},
	{
		title: "Charming Studio",
		description: "Cozy studio in a vibrant neighborhood.",
		image: "https://images.unsplash.com/photo-1559152087-c0f2d0490a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 700,
		location: "Lisbon",
		country: "Portugal"
	},
	{
		title: "Romantic Cabin",
		description: "Perfect for couples, this cabin offers privacy and charm.",
		image: "https://images.unsplash.com/photo-1519976502-20fcbf5f9b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1100,
		location: "Big Sur",
		country: "United States"
	},
	{
		title: "Cliffside House",
		description: "Unique house with breathtaking cliffside views.",
		image: "https://images.unsplash.com/photo-1494526585095-c41746248156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 3200,
		location: "Capri",
		country: "Italy"
	},
	{
		title: "Forest Lodge",
		description: "Experience serenity in this cozy lodge surrounded by trees.",
		image: "https://images.unsplash.com/photo-1519832954211-c3b6d2b9d479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 1200,
		location: "Banff",
		country: "Canada"
	},
	{
		title: "Island Villa",
		description: "Exclusive island villa with panoramic ocean views.",
		image: "https://images.unsplash.com/photo-1541364983171-a8ba01dc52b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 6000,
		location: "Maldives",
		country: "Maldives"
	},
	{
		title: "Urban Loft",
		description: "Trendy loft with easy access to shops and restaurants.",
		image: "https://images.unsplash.com/photo-1545259744-7449b0c3aa2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
		price: 2000,
		location: "Berlin",
		country: "Germany"
	},
];


module.exports = {data: sampleListings};