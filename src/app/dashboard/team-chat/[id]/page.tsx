export default async function TeamChatPage({ params }: {
    params: {
        id: string;
    }
}) {
    const { id } = await params;

    return (
        <div>
            {id}
        </div>
    );
}