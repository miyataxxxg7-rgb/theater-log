import { redirect } from 'next/navigation';

export default function Home() {
  // アプリを開いたら、自動的に「劇場（/theater）」の画面に飛ばす
  redirect('/theater');
}





