// Modern geolocation API
export const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
}

export const getLocation = async () => {
  try {
    const position = await getPosition();
    console.log(`Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`);
    return position;
  } catch (error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        throw new Error("Location permission denied");
      case error.POSITION_UNAVAILABLE:
        throw new Error("Location unavailable");
      case error.TIMEOUT:
        throw new Error("Location request timed out");
      default:
        throw error;
    }
  }
}
