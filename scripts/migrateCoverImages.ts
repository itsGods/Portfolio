import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, getStorage } from "firebase/storage";
import { db, app } from "../src/firebase";

const storage = getStorage(app);

export const migrateCoverImages = async () => {
  try {
    const snapshot = await getDocs(collection(db, "posts"));
    for (const document of snapshot.docs) {
      const data = document.data();
      if (data.coverImage && data.coverImage.startsWith('data:image')) {
        try {
          const storageRef = ref(storage, `covers/${data.slug}-migrated.webp`);
          await uploadString(storageRef, data.coverImage, 'data_url');
          const url = await getDownloadURL(storageRef);
          await updateDoc(doc(db, "posts", document.id), { coverImage: url });
          console.log(`✓ migrated: ${data.slug}`);
        } catch (err) {
          console.error(`✗ failed: ${data.slug} —`, err);
        }
      }
    }
    console.log("Migration complete.");
  } catch (error) {
    console.error("Migration failed to start:", error);
  }
};
