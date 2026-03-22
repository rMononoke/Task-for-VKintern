import { Button, Card, Div, Group, Header, Text, Title } from '@vkontakte/vkui'
import { useNavigate } from 'react-router'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Group header={<Header>404</Header>}>
      <Card mode="shadow">
        <Div className="details-card">
          <Title level="2" weight="2">
            Страница не найдена
          </Title>
          <Text>
            Упс... кажется произошла ошибка
          </Text>
          <Button size="m" onClick={() => navigate('/')}>
            Перейти в каталог
          </Button>
        </Div>
      </Card>
    </Group>
  )
}
